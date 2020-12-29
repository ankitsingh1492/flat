import React from "react";
import { Tabs } from "antd";
import { ChatMessages, ChatMessagesProps } from "./ChatMessages";
import { ChatUsers } from "./ChatUsers";
import { RtmRenderProps } from "../Rtm";
import { Identity } from "../../utils/localStorage/room";

import "./ChatPanel.less";

export interface ChatPanelProps {
    userId: string;
    channelId: string;
    identity: ChatMessagesProps["identity"];
    rtm: RtmRenderProps;
    allowMultipleSpeakers: boolean;
}

export class ChatPanel extends React.Component<ChatPanelProps> {
    render() {
        const { identity, userId } = this.props;
        const {
            messages,
            speakingJoiners,
            handRaisingJoiners,
            creator,
            joiners,
            currentUser,
            isBan,
            onMessageSend,
            onCancelAllHandRaising,
            updateHistory,
            onToggleHandRaising,
            onToggleBan,
        } = this.props.rtm;
        return (
            <div className="chat-panel">
                <Tabs defaultActiveKey="messages" tabBarGutter={0}>
                    <Tabs.TabPane tab="消息列表" key="messages">
                        <ChatMessages
                            userId={userId}
                            identity={identity}
                            messages={messages}
                            isRaiseHand={!!currentUser?.isRaiseHand}
                            isBan={isBan}
                            onMessageSend={onMessageSend}
                            onLoadMore={updateHistory}
                            onSwitchHandRaising={onToggleHandRaising}
                            onBanChange={onToggleBan}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="用户列表" key="users">
                        <ChatUsers
                            isShowCancelAllHandRaising={
                                handRaisingJoiners.length > 0 && identity === Identity.creator
                            }
                            identity={identity}
                            userId={userId}
                            speakingJoiners={speakingJoiners}
                            handRaisingJoiners={handRaisingJoiners}
                            creator={creator}
                            joiners={joiners}
                            onAcceptRaiseHand={this.onAcceptRaiseHand}
                            onEndSpeaking={this.onEndSpeaking}
                            onCancelAllHandRaising={onCancelAllHandRaising}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        );
    }

    private onAcceptRaiseHand = (uid: string): void => {
        const { allowMultipleSpeakers } = this.props;
        const { speakingJoiners, acceptRaisehand } = this.props.rtm;
        if (speakingJoiners.length > 0 && !allowMultipleSpeakers) {
            // only one speaker is allowed
            return;
        }
        acceptRaisehand(uid);
    };

    private onEndSpeaking = (uid: string): void => {
        this.props.rtm.allowSpeak(uid, false, false);
    };
}

export default ChatPanel;
