import CoreSpeedmod from 'parser/core/modules/Speedmod'

import STATUSES from 'data/STATUSES'
import {JOB_SPEED_BUFF_TO_SPEEDMOD_MAP} from 'parser/core/modules/SpeedmodConsts'

export default class Speedmod extends CoreSpeedmod {
	/* NOTE: Use this to force modules to run before Speedmod. ie: normalise to generate Huton events so Speedmod can pick them up natively
	static dependencies = [
		...CoreSpeedmod.dependencies,
		'forms',
	]
	*/

	_isRofActive = false

	constructor(...args) {
		super(...args)
		this.SPEED_BUFF_STATUS_IDS.push(
			STATUSES.GREASED_LIGHTNING_I.id,
			STATUSES.GREASED_LIGHTNING_II.id,
			STATUSES.GREASED_LIGHTNING_III.id,
		)
	}

	jobSpecificNormaliseLogic(event) {
		const types = ['applybuff', 'removebuff', 'applybuffstack']

		if (!types.includes(event.type)) {
			return
		}

		switch (event.type) {
		case 'applybuff':
			if (event.ability.guid === STATUSES.RIDDLE_OF_FIRE.id) {
				this._isRofActive = true
			}
			break
		case 'removebuff':
			if (event.ability.guid === STATUSES.RIDDLE_OF_FIRE.id) {
				this._isRofActive = false
			}
			break
		case 'applybuffstack':
			if (event.ability.guid === STATUSES.GREASED_LIGHTNING_I.id) {
				// applybuffstack only shows for stacks 2 and 3 of GL
				// removebuffstack doesn't show for GL. This is handled by removebuff in parent
				this._activeSpeedMap = JOB_SPEED_BUFF_TO_SPEEDMOD_MAP[event.ability.guid + event.stack - 1]
			}
			break
		}
	}

	getJobAdditionalSpeedbuffScalar() {
		if (this._isRofActive) {
			return 1.15
		}
		return 1.0
	}
}
