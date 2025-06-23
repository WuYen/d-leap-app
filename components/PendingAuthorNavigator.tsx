import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pendingAuthorState } from '../states/pushNotificationState';
import { navigationReadyState } from '../states/navigationState';
import { navigateToAuthorDetail } from '../navigation/navigationRef';

export default function PendingAuthorNavigator() {
  const navigationReady = useRecoilValue(navigationReadyState);
  const [pendingAuthor, setPendingAuthor] = useRecoilState(pendingAuthorState);

  useEffect(() => {
    if (navigationReady && pendingAuthor) {
      navigateToAuthorDetail(pendingAuthor);
      setPendingAuthor(null);
    }
  }, [navigationReady, pendingAuthor, setPendingAuthor]);

  return null;
}
