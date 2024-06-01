import React, {useState, useEffect, useCallback} from "react"
import {Button} from "@strapi/design-system"
import {useSelector} from 'react-redux';
import {useCMEditViewDataManager, useFetchClient, useNotification} from '@strapi/helper-plugin';
import {TriggerButtonInfo} from "../../../../types";

console.log('co vao day ko ne')
const Index = ({}) => {
    const toggleNotification = useNotification();
    const {modifiedData} = useCMEditViewDataManager();
    const {get, post} = useFetchClient();
    // @ts-ignore
    const {currentLayout: {contentType}} = useSelector((state) => {
        // @ts-ignore
        return state['content-manager_editViewLayoutManager'] || {};
    });
    const [loading, setLoading] = useState(false);
    const [triggerButtons, setTriggerButtons] = useState<TriggerButtonInfo[]>([])

    const showNotification = (message: string, type = 'warning') => {
        toggleNotification({
            // required
            type,
            // required
            message: {id: 'trigger.button.message', defaultMessage: message},
            // optional
            title: {id: 'Api Action', defaultMessage: 'Trigger Api Action: '},
        });
    }

    useEffect(() => {
        (async () => {
            const apiID = contentType?.apiID;
            if (!apiID) {
                return;
            }
            try {
                const response = await get(`github-action-trigger/telegram-buttons`, {
                    params: {apiID},
                    validateStatus: (status: number) => status === 200,
                });
                const {enabled, buttons} = response.data;

                setTriggerButtons(enabled ? buttons : [])
            } catch (e) {
                console.error(e);
            }
        })();
    }, [contentType?.apiID]);

    const handleClick = useCallback((buttonID: string) => async () => {
            try {
                setLoading(true);
                const id = modifiedData.id;
                const response = await post(`github-action-trigger/telegram-trigger`, {buttonID, id}, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setLoading(false);
                const {type, message} = response.data;
                showNotification(message, type);
            } catch (e) {
                setLoading(false);
            }
        }
        , []);
    return (
        <>
            {triggerButtons.map(({buttonID, label, variant}) => (
                <Button
                    variant={variant || 'success-light'}
                    key={buttonID} loading={loading}
                    onClick={handleClick(buttonID)}>
                    {label}
                </Button>
            ))}
        </>
    )
}

export default Index;
