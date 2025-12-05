// accountApi.ts
import { api } from "@/libs/configuration";
import { accountMap, accountMapper } from "../core/mapping";
import { Account } from "../core/types";
import { AccountCreationRequest, AccountPatchRequest, AccountUpdateRequest, TopUpRequest } from "../core/dto/request";
import { AccountResponse, ApiResponse, TopUpResponse } from "../core/dto/response";

// --------------------- CREATE ---------------------
// Tạo account (dành cho admin)
export const createAccountForAdmin = async (request: AccountCreationRequest): Promise<Account> => {

    try {
        const response = await api.post<ApiResponse<AccountResponse>>("/accounts", request);
        return accountMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// --------------------- UPDATE (PUT) ---------------------
export const updateAccountForAdmin = async (request: AccountUpdateRequest, id: string): Promise<Account> => {
    try {
        const response = await api.put<ApiResponse<AccountResponse>>(`/accounts/${id}`, request);
        return accountMap.fromResponse(response.data.result);
            
    } catch (error) {
        throw error;
    }
};

// --------------------- PATCH ---------------------
export const patchAccount = async (request: AccountPatchRequest, id: string): Promise<Account> => {
    try {
        const response = await api.patch<ApiResponse<AccountResponse>>(`/accounts/${id}`, request);
        return accountMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// --------------------- GET ALL ---------------------
export const getAccounts = async (): Promise<Account[]> => {
    try {
        const response = await api.get<ApiResponse<AccountResponse[]>>("/accounts");
        return response.data.result.map(acc =>
            accountMapper.map<AccountResponse, Account>(acc, 'AccountResponse', 'Account')
        );
    } catch (error) {
        throw error;
    }
};

// --------------------- GET BY ID ---------------------
export const getAccountById = async (id: string): Promise<Account> => {
    try {
        const response = await api.get<ApiResponse<AccountResponse>>(`/accounts/${id}`);
        return accountMapper.map<AccountResponse, Account>(
            response.data.result,
            'AccountResponse',
            'Account'
        );
    } catch (error) {
        throw error;
    }
};

// --------------------- TOP-UP ---------------------
export const topUpAccount = async (request: TopUpRequest): Promise<ApiResponse<TopUpResponse>> => {
    try {
        const response = await api.post<ApiResponse<TopUpResponse>>(`/accounts/top-up`, request);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --------------------- LOCK/UNLOCK ---------------------
export const toggleAccountStatus = async (id: string, isActive: boolean): Promise<Account> => {
    try {
        const response = await api.patch<ApiResponse<AccountResponse>>(`/accounts/${id}`, {
            status: isActive ? "ACTIVE" : "INACTIVE",
        });
        return accountMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};