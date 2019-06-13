import {
  TRANSACTION_TYPE,
  WithId,
  WithSender,
  IInvokeScriptParams,
  IInvokeScriptTransaction
} from '../transactions'
import { crypto, } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'

const { signBytes, blake2b } = crypto()

/* @echo DOCS */
export function invokeScript(params: IInvokeScriptParams, seed: TSeedTypes): IInvokeScriptTransaction & WithId
export function invokeScript(paramsOrTx: IInvokeScriptParams & WithSender | IInvokeScriptTransaction, seed?: TSeedTypes): IInvokeScriptTransaction & WithId
export function invokeScript(paramsOrTx: any, seed?: TSeedTypes): IInvokeScriptTransaction & WithId {
  const type = TRANSACTION_TYPE.INVOKE_SCRIPT
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: IInvokeScriptTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    dApp: paramsOrTx.dApp,
    call: paramsOrTx.call && {args: [], ...paramsOrTx.call},
    payment: paramsOrTx.payment || [],
    fee: fee(paramsOrTx, 1000000),
    feeAssetId: paramsOrTx.feeAssetId,
    timestamp: paramsOrTx.timestamp || Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = blake2b(bytes)

  return tx
}
