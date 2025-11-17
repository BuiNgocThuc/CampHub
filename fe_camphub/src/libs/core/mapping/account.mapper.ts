// account.mapper.ts
import { createMapper, createMap} from '@automapper/core';
import { pojos, PojosMetadataMap } from '@automapper/pojos';
import { Account } from '../types/account.model';
import { AccountResponse } from '../dto/response';
import { AccountCreationRequest, AccountUpdateRequest, AccountPatchRequest } from '../dto/request';

export const accountMapper = createMapper({
    strategyInitializer: pojos(),
});

PojosMetadataMap.create<Account>('Account', {});
PojosMetadataMap.create<AccountResponse>('AccountResponse', {});
PojosMetadataMap.create<AccountCreationRequest>('AccountCreationRequest', {});
PojosMetadataMap.create<AccountUpdateRequest>('AccountUpdateRequest', {});
PojosMetadataMap.create<AccountPatchRequest>('AccountPatchRequest', {});

createMap<AccountResponse, Account>(accountMapper, 'AccountResponse', 'Account');
createMap<Account, AccountCreationRequest>(accountMapper, 'Account', 'AccountCreationRequest');
createMap<Account, AccountUpdateRequest>(accountMapper, 'Account', 'AccountUpdateRequest');
createMap<Account, AccountPatchRequest>(accountMapper, 'Account', 'AccountPatchRequest');

export const accountMap = {
    /** ResponseDTO -> Model */
    fromResponse: (dto: AccountResponse): Account => {
        return accountMapper.map(dto, 'Account', 'AccountResponse');
    },

    /** Model -> CreationRequest */
    toCreationRequest: (model: Account): AccountCreationRequest => {
        return accountMapper.map(model, 'AccountCreationRequest', 'Account');
    },

    /** Model -> UpdateRequest */
    toUpdateRequest: (model: Account): AccountUpdateRequest => {
        return accountMapper.map(model, 'AccountUpdateRequest', 'Account');
    },

    /** Model -> PatchRequest */
    toPatchRequest: (model: Partial<Account>): AccountPatchRequest => {
        return accountMapper.map(model, 'AccountPatchRequest', 'Account');
    },
};