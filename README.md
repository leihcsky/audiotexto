# VozTexto

面向西班牙语用户的免费在线音频转文字工具。用户无需注册即可上传音频，由服务端调用 [Replicate](https://replicate.com) 上的 [`vaibhavs10/incredibly-fast-whisper`](https://replicate.com/vaibhavs10/incredibly-fast-whisper) 转录模型，并在页面上复制或下载 UTF-8 文本。

## 本地运行

需要 Node.js 20.9 或更高版本。`music-metadata` 的安装声明写的是 Node.js 22，在 20.17 上 `npm install` 会打印 engine 警告，但测试和构建可以跑完。如果安装因 engine 检查失败，把 Node 升到 22。

```bash
npm install
copy .env.example .env.local
```

在 `.env.local` 中填入 `REPLICATE_API_TOKEN`，然后：

```bash
npm run dev
```

打开 http://localhost:3000 。没有 API Token 时，转录接口会返回西班牙语配置错误，不会返回假结果。

## 脚本

| 命令 | 作用 |
|---|---|
| `npm run dev` | 本地开发 |
| `npm run test` | 校验、限流、错误文案等单元测试 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run build` | 生产构建 |
| `npm start` | 运行生产构建 |

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `REPLICATE_API_TOKEN` | 空 | 只在服务端使用，不要写入代码或提交到仓库 |
| `REPLICATE_TRANSCRIPTION_MODEL` | `vaibhavs10/incredibly-fast-whisper:<latest>` | 社区模型必须写 `owner/name:version`；只写 `owner/name` 时会自动解析最新 version |
| `MAX_AUDIO_SIZE_MB` | `25` | 单文件大小上限。大于 100 会按 100 MB 处理，因为这是 Replicate 上传上限 |
| `MAX_AUDIO_DURATION_SECONDS` | `600` | 单次音频最长秒数 |
| `DAILY_REQUEST_LIMIT` | `3` | 每个客户端每天可发起的转录次数，按 UTC 日计算 |
| `MAX_CONCURRENT_REQUESTS` | `1` | 每个客户端同时进行的转录数 |
| `REPLICATE_TIMEOUT_MS` | `120000` | Replicate 请求超时 |
| `SITE_URL` | `http://localhost:3000` | canonical 和 sitemap 使用的站点地址，不要带末尾斜杠 |
| `TRUSTED_IP_HEADER` | 空 | 由反向代理覆盖写入的客户端 IP 头，例如 `x-real-ip` |
| `TRUSTED_PROXY_COUNT` | `0` | 仅在使用 `x-forwarded-for` 时需要，填你控制的代理层数 |
| `GA_MEASUREMENT_ID` | 空 | GA4 ID，形如 `G-XXXX`。留空则不加载统计脚本 |
| `GOOGLE_SITE_VERIFICATION` | 空 | Search Console 的 HTML 标记校验值 |
| `CONTACT_EMAIL` | 空 | 联系页和隐私页展示的邮箱 |

只有通过格式和时长校验、即将调用 API 的请求才计入每日次数。格式错误不会消耗额度。API 失败仍会计入，因为请求已经发出。

## 部署

适合单台 Node 进程：

```bash
npm ci
npm run build
npm start
```

上线前：

1. 配置 `REPLICATE_API_TOKEN`、`SITE_URL` 和用量限制。
2. 在 Replicate 账户里准备好余额或账单告警，并定期看用量。
3. 反向代理允许至少 25 MB 的请求体，并用它自己覆盖的头传递客户端 IP。然后设置 `TRUSTED_IP_HEADER`。不要信任浏览器自行提交的 `X-Forwarded-For`。
4. 如果使用 `x-forwarded-for`，把 `TRUSTED_PROXY_COUNT` 设为你控制的代理数量。程序取从右往左数的那一跳。
5. 填写 `CONTACT_EMAIL`。需要统计时再填 `GA_MEASUREMENT_ID`。
6. 用 Search Console 提交 `https://你的域名/sitemap.xml`，并确认页面没有 `noindex`。

限流计数放在进程内存里。进程重启后计数清空。多实例或 Serverless 不会共享额度，这种部署在上线前要换成 Redis 一类的共享存储。当前代码把计数集中在 `lib/rate-limit.ts`，方便以后替换。

生产环境如果没有设置 `TRUSTED_IP_HEADER`，所有访客会共用同一个额度桶，服务端会打一条警告日志。

## 行为说明

- 接受 MP3、WAV、M4A、MP4、MPEG、MPGA 和 WebM。服务端同时检查扩展名、MIME 和文件头，再用文件头读取时长。
- 音频只留在本次请求的内存中，成功或失败后都会清掉，不写入磁盘。
- 发给 Replicate 的文件名是固定的 `audio.mp3` 这类名字，不上传用户原始文件名。默认自动检测音频语言并按原语言转录，不做翻译。
- 日志只记录请求 ID、大小、时长、耗时、错误码和 IP 的摘要，不记录 API Token、音频内容或完整转录文本。
- 界面、错误和说明页面都是西班牙语。
- 页面事件：`upload_started`、`transcription_started`、`transcription_succeeded`、`transcription_failed`、`transcript_copied`、`transcript_downloaded`、`limit_reached`。没有配置 GA 时这些调用不会发出。事件不包含文件名和转录正文。

## 已知限制

- 还没有用真实 Replicate Token 做端到端转录。配置 Token 后，应用一段西班牙语录音验证结果、重音字符和失败提示。
- Ogg 和 FLAC 当前可能也能转录，但本版没有列入支持格式。
- 没有账号、支付、历史记录、说话人分离、实时麦克风或字幕导出。
- 托管平台如果限制请求体小于 25 MB，需要先放宽该限制。本项目没有使用 Next.js proxy；如果以后加上，还要把 `proxyClientMaxBodySize` 提高到 25 MB 以上。
