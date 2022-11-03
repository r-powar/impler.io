import { useEffect, useState, PropsWithChildren } from 'react';
import * as WebFont from 'webfontloader';
import { useParams } from 'react-router-dom';
import { IUserDataPayload } from '@impler/shared';
import { Global } from '@emotion/react';
import { API_URL } from '@config';
import { Provider } from '../Provider';

export function Container({ children }: PropsWithChildren) {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [userDataPayload, setUserDataPayload] = useState<IUserDataPayload>();
  const [backendUrl, setBackendUrl] = useState(API_URL);
  // const [theme, setTheme] = useState<>({});
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [fontFamily, setFontFamily] = useState<string>('Lato');
  const [frameInitialized, setFrameInitialized] = useState(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: [fontFamily],
      },
    });
  }, [fontFamily]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = ({ data }: any) => {
      if (data && data.type === 'INIT_IFRAME') {
        setUserDataPayload(data.value);

        if (data.value.backendUrl) {
          setBackendUrl(data.value.backendUrl);
        }

        setFrameInitialized(true);
      }
    };

    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line
      (window as any).initHandler = handler;
    }

    window.addEventListener('message', handler);

    window.parent.postMessage({ type: 'WIDGET_READY' }, '*');

    return () => window.removeEventListener('message', handler);
  }, []);

  if (!userDataPayload) return null;

  return (
    <>
      <Global
        styles={{
          '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
          },
        }}
      />
      {frameInitialized ? (
        <Provider
          // api
          backendUrl={backendUrl}
          // impler-context
          projectId={projectId}
          template={userDataPayload.template}
          accessToken={userDataPayload.accessToken}
          authHeaderValue={userDataPayload.authHeaderValue}
          extra={userDataPayload.extra}
        >
          {children}
        </Provider>
      ) : null}
    </>
  );
}