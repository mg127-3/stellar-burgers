import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import {
  fetchUserOrders,
  selectUserOrders,
  selectOrdersStatus
} from '../../services/slices/orders';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectOrdersStatus);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (status === 'loading' && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
