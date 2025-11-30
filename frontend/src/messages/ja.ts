import * as ja from './ja/index'
import type { SameStructure } from './type-utils'

export default ja
export type Messages = SameStructure<typeof ja>
