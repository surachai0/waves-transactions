import { crypto } from '@waves/waves-crypto'
import { serializePrimitives } from '@waves/marshall'
const {BASE58_STRING} = serializePrimitives
import { getSenderPublicKey, convertToPairs } from '../generic'
import { ICancelOrderParams, ICancelOrder } from '../transactions'

const { signBytes } = crypto()
const { concat } = crypto({output: 'Bytes'})

export const cancelOrderParamsToBytes = (cancelOrderParams:{sender: string, orderId: string}) => concat(
  BASE58_STRING(cancelOrderParams.sender),
  BASE58_STRING(cancelOrderParams.orderId)
)

export function cancelOrder(params: ICancelOrderParams, seed: string): ICancelOrder {

  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, {senderPublicKey: undefined})

  const cancelOrderBody: ICancelOrder = {
    sender: senderPublicKey,
    orderId: params.orderId,
    signature: signBytes(
      seed, concat(BASE58_STRING(senderPublicKey), BASE58_STRING(params.orderId))
    ),
  }

  return cancelOrderBody
}


