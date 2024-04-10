import React, {useState, useEffect, useCallback} from "react"
import {Button} from "@strapi/design-system"
import {useSelector} from 'react-redux';
import {useFetchClient, useNotification } from '@strapi/helper-plugin';
import {TriggerButtonInfo} from "../../../../types";
const Index = ({}) => {
   const toggleNotification = useNotification();
  const { get, post } = useFetchClient();
  // @ts-ignore
  const {contentType: {apiID}} = useSelector((state) => state['content-manager_listView'] || {});
  const [loading, setLoading] = useState(false);
  const [triggerButtons, setTriggerButtons] = useState<TriggerButtonInfo[]>([])

  const showNotification = (message: string, type='warning') => {
    toggleNotification({
        // required
        type,
        // required
        message: { id: 'trigger.button.message', defaultMessage: message },
        // optional
        title: { id: 'Api Action', defaultMessage: 'Trigger Api Action: ' },
      });
  }

  useEffect(() => {
    (async () => {
      try {
        console.log('apiID', apiID)
        const response = await get(`github-action-trigger/api-buttons`, {
          params: {apiID},
          validateStatus: (status) => status < 500,
        });
        const {enabled, buttons} = response.data;

        setTriggerButtons(enabled ? buttons : [])
      } catch (e) {
        console.error(e);
      }
    })();
  }, [apiID]);

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClick = useCallback((buttonID: string) => async () => {
    try {
      setLoading(true);
      console.log('buttonID', buttonID)
      const response = await post(`github-action-trigger/api-trigger`, {buttonID}, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const {type, message} = response.data;
      showNotification(message, type);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }
, []);
  return (
    <>
      {triggerButtons.map(({buttonID, label, variant}) => (
        <Button
          variant={variant || 'default'}
          key={buttonID} loading={loading}
          onClick={handleClick(buttonID)}>
          {label}
        </Button>
      ))}
    </>
  )
}

export default Index;
