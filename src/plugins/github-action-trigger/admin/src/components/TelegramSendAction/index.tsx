import React, {useState, useEffect, useCallback} from "react"
import {Button} from "@strapi/design-system"
import {useSelector} from 'react-redux';
import {useCMEditViewDataManager, useFetchClient, useNotification} from '@strapi/helper-plugin';
import {TriggerButtonInfo} from "../../../../types";
import {Box, Divider, Flex, Typography} from '@strapi/design-system';
import {Dialog, DialogBody, DialogFooter} from '@strapi/design-system';

const formatDateFully = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${hour}:${minute} ${day}/${month}/${year}`;
};

interface KeyValuePairProps {
    label: string;
    value?: string;
}

const KeyValuePair = ({label, value = '-'}: KeyValuePairProps) => {
    return (
        <Flex justifyContent="space-between">
            <Typography as="dt" fontWeight="bold" textColor="neutral800" variant="pi">
                {label}
            </Typography>
            <Typography as="dd" variant="pi" textColor="neutral600">
                {value}
            </Typography>
        </Flex>
    );
};
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
    const [lastTime, setLastTime] = useState<string>();
    const [triggerButtons, setTriggerButtons] = useState<TriggerButtonInfo[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [buttonActionId, setButtonActionId] = useState('');

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
                const {enabled, buttons, lastTriggered} = response.data;
                if (lastTriggered !== null) {
                    setLastTime(formatDateFully(new Date(lastTriggered)));
                }

                setTriggerButtons(enabled ? buttons : [])
            } catch (e) {
                console.error(e);
            }
        })();
    }, [contentType?.apiID]);

    const handleClick = useCallback((buttonID: string) => async () => {
            const id = modifiedData.id;
            if (id) {
                setButtonActionId(buttonID);
                setIsVisible(true);
            } else showNotification('Please save the data before send notifications', 'warning');
        }
        , []);

    const handleSendAction = useCallback(async () => {

            const id = modifiedData.id;
            if (!id) {
                setIsVisible(false);
                showNotification('Please save the data before send notifications', 'warning');
                return;
            }
            try {
                setLoading(true);
                const response = await post(`github-action-trigger/telegram-trigger`, {buttonID: buttonActionId, id}, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setLoading(false);
                const {type, message, isProduction} = response.data;
                showNotification(message, type);
                setIsVisible(false);
                if (isProduction === true) {
                    setLastTime(formatDateFully(new Date()));
                }
                setButtonActionId('');
            } catch (e) {
                setLoading(false);
            }
        }
        , [buttonActionId]);
    if (triggerButtons.length === 0) {
        return <></>;
    }
    return (
        <>
            <Dialog onClose={() => setIsVisible(false)} title="Confirmation" isOpen={isVisible}>
                <DialogBody>
                    <Flex direction="column" alignItems="center" gap={2}>
                        <Flex justifyContent="center">
                            <Typography id="confirm-description">Are you sure to send telegram
                                notifications??</Typography>
                        </Flex>
                    </Flex>
                </DialogBody>
                <DialogFooter startAction={<Button onClick={() => setIsVisible(false)} variant="tertiary">
                    Cancel
                </Button>} endAction={<Button variant="danger-light" onClick={() => {
                    handleSendAction().then(() => setIsVisible(false));
                }}>
                    Confirm
                </Button>}/>
            </Dialog>
            <Box
                as="aside"
                aria-labelledby="telegram-additional-information"
                background="neutral0"
                borderColor="neutral150"
                hasRadius
                paddingBottom={4}
                paddingLeft={4}
                paddingRight={4}
                paddingTop={6}
                shadow="tableShadow"
            >
                <Flex direction="column" alignItems="stretch" gap={4}>
                    <Flex direction="column" alignItems="stretch" gap={2}>
                        <Typography variant="sigma" textColor="neutral600" id="telegram-additional-information">
                            Telegram Action
                        </Typography>

                        <Box>
                            <Divider/>
                        </Box>
                    </Flex>
                    <Flex direction="column" alignItems="stretch" gap={4}>
                        <Flex direction="column" alignItems="stretch" gap={2} as="dl">
                            <KeyValuePair
                                label={'Last Time Build Production'}
                                value={lastTime ?? 'No build yet'}
                            />
                        </Flex>
                    </Flex>


                    {triggerButtons.map(({buttonID, label, variant}) => (
                        <Button
                            variant={variant || 'success-light'}
                            key={buttonID} loading={loading}
                            onClick={handleClick(buttonID)}>
                            {label}
                        </Button>
                    ))}
                </Flex>
            </Box>
        </>
    )
}

export default Index;
