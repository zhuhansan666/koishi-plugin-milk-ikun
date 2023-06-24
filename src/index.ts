import { Context, Dict, Schema, Session } from 'koishi'

import { allows } from './contants'

export const name = 'milk-ikun'
export const usage = `
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

export const Config: Schema<Config> = Schema.object({
    ikunKeywords: Schema.dict(String)
        .default({
            '2.5': '2.4999999999',
            '两年半': '哼! 你才练习了两年半呢! 不许黑我家哥哥',
            '你干嘛': '小黑子, 露出鸡脚了吧',
            '114514': '哼哼哼~啊啊啊啊'
        })
        .role('table')
        .description('将指定关键字 key 替换为 value **支持正则表达式**'),
})

export function apply(ctx: Context, config: Config) {
    // eventName: before-send

    ctx.on('before-send', (session: Session) => {
        // 返回值 true 拒绝发送, false/undefined/void 放行发送, 并且在这里改 session.context = * 有用
        for (const i in allows) {
            const value = allows[i]
            if (session.content.startsWith(value)) {
                session.content = session.content.replace(value, '')  // 将特殊字符替换为空
                return false  // 直接放行
            }
        }

        for (const key in config.ikunKeywords) {
            session.content = session.content.replace(new RegExp(key), config.ikunKeywords[key])
        }
        // for (const index in session.elements) {  // 这样时间复杂度太高了吧
        //     const element = session.elements[index]
        //     if (element.type === 'text') {
        //         for (const key in config.ikunKeywords) {
        //             element.attrs.content = element.attrs.content.replace(new RegExp(key), config.ikunKeywords[key])
        //         }
        //     }
        // }
    })
}
