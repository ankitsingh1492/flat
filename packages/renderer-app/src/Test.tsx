import * as React from "react";
import { Button } from "antd";
import { DownloadFile } from "./utils/download";
import { extractZIP } from "./utils/unzip";
import { removeSync } from "fs-extra";
import { Link } from "react-router-dom";

export default class Test extends React.Component<
    {},
    {
        downloadProgress: number;
    }
> {
    constructor(props: {}) {
        super(props);
        this.state = {
            downloadProgress: 0,
        };
    }

    private noticeDownloadZip = (url: string) => {
        const download = new DownloadFile(url);

        download.onProgress(p => {
            this.setState({
                downloadProgress: p.progress,
            });
        });

        download.onEnd(d => {
            console.log("下载完成");
            console.log("开始解压");

            extractZIP(d.filePath)
                .then(() => {
                    console.log("解压完成");

                    // 解压成功后删除压缩文件
                    removeSync(d.filePath);
                    // console.log(download.fileIsExists(d.filePath));
                    // console.log(runtime.downloadsDirectory);
                    // 清空文件夹下的所有内容
                    // emptyDirSync(runtime.downloadsDirectory);
                })
                .catch(e => {
                    console.log("解压失败");
                    console.log(e);
                });
        });

        download.onError(e => {
            console.error("下载失败");
            console.error(e);
        });

        console.log(`文件是否已经存在: ${download.fileIsExists("test.zip")}`);

        download.start();
    };

    public render(): React.ReactNode {
        return (
            <div className="page-index-box">
                <Button
                    onClick={() =>
                        this.noticeDownloadZip(
                            "https://white-sdk.oss-cn-beijing.aliyuncs.com/images/test.zip",
                        )
                    }
                >
                    点击下载
                </Button>
                <Link to={"/"}>
                    <Button>返回</Button>
                </Link>
                <div>下载百分比: {this.state.downloadProgress}%</div>
                https://white-sdk.oss-cn-beijing.aliyuncs.com/images/test.zip
            </div>
        );
    }
}