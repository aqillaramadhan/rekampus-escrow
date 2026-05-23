#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    token, Address, Env, Symbol,
};

// ─────────────────────────────────────────────
// Data types
// ─────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum EscrowStatus {
    Initialized,
    Funded,
    Released,
    Cancelled,
}

#[contracttype]
#[derive(Clone)]
pub struct Escrow {
    pub buyer: Address,
    pub seller: Address,
    pub token: Address,
    pub amount: i128,
    pub status: EscrowStatus,
}

// ─────────────────────────────────────────────

const ESCROW_KEY: Symbol = symbol_short!("ESCROW");

// ─────────────────────────────────────────────

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {

    pub fn create_escrow(
        env: Env,
        buyer: Address,
        seller: Address,
        token: Address,
        amount: i128,
    ) {
        buyer.require_auth();

        assert!(amount > 0);
        assert!(buyer != seller);

        assert!(
            !env.storage().instance().has(&ESCROW_KEY),
            "Escrow exists"
        );

        let escrow = Escrow {
            buyer,
            seller,
            token,
            amount,
            status: EscrowStatus::Initialized,
        };

        env.storage().instance().set(&ESCROW_KEY, &escrow);
        env.storage().instance().extend_ttl(518_400, 518_400);
    }

    pub fn deposit(env: Env) {
        let mut escrow: Escrow = Self::load_escrow(&env);

        escrow.buyer.require_auth();

        assert!(escrow.status == EscrowStatus::Initialized);

        let token_client = token::Client::new(&env, &escrow.token);

        token_client.transfer(
            &escrow.buyer,
            &env.current_contract_address(),
            &escrow.amount,
        );

        escrow.status = EscrowStatus::Funded;
        env.storage().instance().set(&ESCROW_KEY, &escrow);
    }

    pub fn confirm_received(env: Env) {
        let mut escrow: Escrow = Self::load_escrow(&env);

        escrow.buyer.require_auth();

        assert!(escrow.status == EscrowStatus::Funded);

        let token_client = token::Client::new(&env, &escrow.token);

        token_client.transfer(
            &env.current_contract_address(),
            &escrow.seller,
            &escrow.amount,
        );

        escrow.status = EscrowStatus::Released;
        env.storage().instance().set(&ESCROW_KEY, &escrow);
    }

    pub fn cancel(env: Env) {
        let mut escrow: Escrow = Self::load_escrow(&env);

        escrow.buyer.require_auth();

        assert!(
            escrow.status == EscrowStatus::Initialized
                || escrow.status == EscrowStatus::Funded
        );

        if escrow.status == EscrowStatus::Funded {
            let token_client = token::Client::new(&env, &escrow.token);
            token_client.transfer(
                &env.current_contract_address(),
                &escrow.buyer,
                &escrow.amount,
            );
        }

        escrow.status = EscrowStatus::Cancelled;
        env.storage().instance().set(&ESCROW_KEY, &escrow);
    }

    pub fn get_escrow(env: Env) -> Escrow {
        Self::load_escrow(&env)
    }

    fn load_escrow(env: &Env) -> Escrow {
        env.storage()
            .instance()
            .get(&ESCROW_KEY)
            .expect("No escrow")
    }
}

// ─────────────────────────────────────────────
// TEST
// ─────────────────────────────────────────────

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{
        testutils::Address as _,
        token::{Client as TokenClient, StellarAssetClient},
        Address, Env,
    };

    fn create_token<'a>(env: &Env, admin: &Address) -> (Address, StellarAssetClient<'a>) {
        let contract_id = env.register_stellar_asset_contract_v2(admin.clone());
        let token_address = contract_id.address();
        let sac = StellarAssetClient::new(env, &token_address);
        (token_address, sac)
    }

    #[test]
    fn test_full_flow() {
        let env = Env::default();
        env.mock_all_auths();

        let buyer  = Address::generate(&env);
        let seller = Address::generate(&env);
        let admin  = Address::generate(&env);

        let (token_addr, sac) = create_token(&env, &admin);
        sac.mint(&buyer, &1000);

        let contract_id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &contract_id);

        let token = TokenClient::new(&env, &token_addr);

        client.create_escrow(&buyer, &seller, &token_addr, &500);
        client.deposit();

        assert_eq!(token.balance(&buyer), 500);
        assert_eq!(token.balance(&contract_id), 500);

        client.confirm_received();

        assert_eq!(token.balance(&seller), 500);

        let e = client.get_escrow();
        assert_eq!(e.status, EscrowStatus::Released);
    }
}