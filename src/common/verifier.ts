import { Context } from "koishi"

import { logger } from "../contants"

export async function countryCheck(ctx: Context) {
    /**
     * @returns true -> 合法国家与地区; false -> 不合法或发生错误
     */

    try {
        const { data } = await ctx.http.axios(`http://ip-api.com/json/`, { validateStatus: (status) => { return true } })
        logger.debug(data)
        if (!data) {
            return false
        } else if (data && data.status !== 'success') {
            return false
        }

        if (data.countryCode && data.countryCode !== 'CN') {
            logger.debug(`check countries and regions success: ${data.countryCode} (${data.country}), unsupported!`)
            return false
        }

        logger.debug(`check countries and regions success: ${data.countryCode} (${data.country}), is supported!`)
        return true
    } catch(error) {
        logger.warn(`check countries and regions error: ${error.stack ?? error}`)
        return false
    }
}
