import { Context, Dict, Schema, Session } from 'koishi'
import {  } from '@koishijs/plugin-config'

import { allows, logger } from './contants'
import { countryCheck } from './common/verifier'

export const name = 'milk-ikun'
export let usage = `
# koishi-plugin-milk-ikun
  ## 让您的机器人不再小黑子!

<h3 style="margin: 0; margin-bottom: 8px;">最新版本:
    <a target="_blank" href="https://www.npmjs.com/package/koishi-plugin-milk-ikun">
        <img src="https://img.shields.io/npm/v/koishi-plugin-milk-ikun?color=527dec&label=&">
    </a>
</h3>
`

export interface Config {
    ikunKeywords: Dict,
}

export let Config: Schema<Config> | any = Schema.object({
    ikunKeywords: Schema.dict(String)
        .default({
            '2.5': '2.4999999999',
            '两年半': '哼! 你才练习了两年半呢! 不许黑我家哥哥',
            '你干嘛': '小黑子, 露出鸡脚了吧',
            '只因': '小黑子, 露出鸡脚了吧',
            '114514': '哼哼哼~啊啊啊啊'
        })
        .role('table')
        .description('将指定关键字 key 替换为 value **支持正则表达式**'),
})

export async function apply(ctx: Context, config: Config) {
    if (!await countryCheck(ctx)) {
        usage = `# Your country or region is not supported because of cultural reasons.`
        Config = Schema.object({})
        logger.error(`unsupported country or region! stop loading ${name}!`)
        return
    }

    // eventName: before-send
    ctx.on('before-send', (session: Session) => {
        // 返回值 true 拒绝发送, false/undefined/void 放行发送, 并且在这里改 session.context = * 有用
        for (const pluginName in allows) {
            const allow = allows[pluginName]

            let result = null
            try {
                result = globalThis[pluginName]['__ikun']()
            } catch(error) {}  // pass

            if (result && result === allow) {
                logger.debug(`plugin: ${pluginName}, passed!`)
                return false  // 直接放行
            }
        }

        for (const key in config.ikunKeywords) {
            session.content = session.content.replace(new RegExp(key), config.ikunKeywords[key])
        }
    })
}
