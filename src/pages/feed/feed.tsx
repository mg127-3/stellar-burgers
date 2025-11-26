import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  selectFeedStatus,
  selectFeedOrders
} from '../../services/slices/feed';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const status = useSelector(selectFeedStatus);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  useEffect(() => {
    if (status === 'idle') {
      handleGetFeeds();
    }
  }, [status, dispatch]);

  if (status === 'loading' && !orders.length) {
    return <Preloader />;
  }

  console.log('orders length = ', orders.length, orders);
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
