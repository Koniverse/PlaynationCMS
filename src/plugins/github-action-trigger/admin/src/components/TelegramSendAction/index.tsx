import React, {useState, useEffect, useCallback} from "react"
import {Button} from "@strapi/design-system"
import {useSelector} from 'react-redux';
import {useCMEditViewDataManager, useFetchClient, useNotification} from '@strapi/helper-plugin';
import {TriggerButtonInfo} from "../../../../types";

console.log('co vao day ko ne')
const Index = ({}) => {
   const toggleNotification = useNotification();
     const { modifiedData } = useCMEditViewDataManager();
  const { get, post } = useFetchClient();
  // @ts-ignore
  const {contentType} = useSelector((state) => state['content-manager_listView'] || {});
  const [loading, setLoading] = useState(false);
  const [triggerButtons, setTriggerButtons] = useState<TriggerButtonInfo[]>([{
    buttonID: 'test',
    label: 'Test',
    variant: "default",

  } as TriggerButtonInfo])

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
      console.log('co vao day ko ne', contentType?.apiID)
      const apiID = contentType?.apiID;
      if (!apiID) {
        return;
      }
      try {
        console.log('apiID', apiID)
        const response = await get(`github-action-trigger/api-buttons`, {
          params: {apiID},
          validateStatus: (status: number) => status === 200,
        });
        const {enabled, buttons} = response.data;

        // setTriggerButtons(enabled ? buttons : [])
      } catch (e) {
        console.error(e);
      }
    })();
  }, [contentType?.apiID]);

  const handleClick = useCallback((buttonID: string) => async () => {
    try {
      setLoading(true);
      console.log('buttonID', buttonID)
      console.log('modifiedData', modifiedData)
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
