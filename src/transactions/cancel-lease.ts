/**
 * @module index
 */
import { TRANSACTION_TYPE, ICancelLeaseTransaction, ICancelLeaseParams, WithId, WithSender } from '../transactions'
import { binary } from '@waves/marshall'
import { base58Encode } from '@waves/ts-lib-crypto/conversions/base-xx'
import { signBytes } from '@waves/ts-lib-crypto/crypto/sign'
import { blake2b } from '@waves/ts-lib-crypto/crypto/hashing'
import { addProof, getSenderPublicKey, convertToPairs, networkByte, fee } from '../generic'
import { TSeedTypes } from '../types'
import { validate } from '../validators'


/* @echo DOCS */
export function cancelLease(params: ICancelLeaseParams, seed: TSeedTypes): ICancelLeaseTransaction & WithId
export function cancelLease(paramsOrTx: ICancelLeaseParams & WithSender | ICancelLeaseTransaction, seed?: TSeedTypes): ICancelLeaseTransaction & WithId
export function cancelLease(paramsOrTx: any, seed?: TSeedTypes): ICancelLeaseTransaction & WithId {
  const type = TRANSACTION_TYPE.CANCEL_LEASE
  const version = paramsOrTx.version || 2
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: ICancelLeaseTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    leaseId: paramsOrTx.leaseId,
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.cancelLease(tx)

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, base58Encode(signBytes(s, bytes)), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
