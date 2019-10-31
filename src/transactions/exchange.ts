/**
 * @module index
 */
import { TRANSACTION_TYPE, IExchangeTransaction, WithId, } from '../transactions'
import { binary } from '@waves/marshall'
import { base58Encode } from '@waves/ts-lib-crypto/conversions/base-xx'
import { signBytes } from '@waves/ts-lib-crypto/crypto/sign'
import { blake2b } from '@waves/ts-lib-crypto/crypto/hashing'
import { addProof, getSenderPublicKey, convertToPairs, fee, normalizeAssetId } from '../generic'
import { TSeedTypes } from '../types'
import { validate } from '../validators'

/* @echo DOCS */
export function exchange(paramsOrTx: IExchangeTransaction, seed?: TSeedTypes): IExchangeTransaction & WithId {

  const type = TRANSACTION_TYPE.EXCHANGE
  const version = paramsOrTx.version || 2
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)


  const tx: IExchangeTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    order1: paramsOrTx.order1,
    order2: paramsOrTx.order2,
    price: paramsOrTx.price,
    amount: paramsOrTx.amount,
    buyMatcherFee: paramsOrTx.buyMatcherFee,
    sellMatcherFee: paramsOrTx.sellMatcherFee,
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.exchange(tx)

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, base58Encode(signBytes(s, bytes)), i))

  return { ...tx, id: base58Encode(blake2b(bytes)) }
}
