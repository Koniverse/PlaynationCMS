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

  const showNotification = (message: string) => {
    toggleNotification({
        // required
        type: 'warning',
        // required
        message: { id: 'trigger.button.message', defaultMessage: message },
        // optional
        title: { id: 'Warning: Trigger Github Action', defaultMessage: 'Trigger Github Action Failed: ' },
      });
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await get(`github-action-trigger/buttons`, {
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
      const response = await post(`github-action-trigger/trigger`, {buttonID}, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const {executed, urlWorkflow, message} = response.data;
      if (executed && urlWorkflow) {
        openInNewTab(urlWorkflow);
      }
      if (!executed && message) {
        showNotification(message);
      }
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
