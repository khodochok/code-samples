import React, { memo, useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { DeliveryAddressForm } from '~/components/DeliveryAddressForm';
import { Modal } from '~/components/Modal';
import { useErrorHandler } from '~/hooks/useErrorHandler';
import {
  useCreateDeliveryAddressMutation,
  useUpdateDeliveryAddressMutation,
} from '~/services/rtkQuery/user';
import { DeliveryAddressFormValues } from '~/types/formValues';
import { DeliveryAddress } from '~/types/models';

import { styles } from './styles';

interface Props {
  visible: boolean;
  deliveryAddressToEdit?: DeliveryAddress;
  onClose: () => void;
}

const Component: React.FC<Props> = ({ visible, deliveryAddressToEdit, onClose }) => {
  const { handleApiError, snackbar } = useErrorHandler();
  const [createDeliveryAddressMutation, { isLoading: isLoadingCreateDeliveryAddressMutation }] =
    useCreateDeliveryAddressMutation();
  const [updateDeliveryAddressMutation, { isLoading: isLoadingUpdateDeliveryAddressMutation }] =
    useUpdateDeliveryAddressMutation();

  const handleSubmit = useCallback(
    async (form: UseFormReturn<DeliveryAddressFormValues>, values: DeliveryAddressFormValues) => {
      try {
        if (deliveryAddressToEdit) {
          await updateDeliveryAddressMutation({
            id: deliveryAddressToEdit.id,
            city: values.city,
            street_name: values.street_name,
            ap_suite: values.ap_suite,
            house_number: values.house_number,
            postal_code: values.postal_code,
            state: values.state,
            default: values.default,
          }).unwrap();
        } else {
          await createDeliveryAddressMutation({
            city: values.city,
            street_name: values.street_name,
            ap_suite: values.ap_suite,
            house_number: values.house_number,
            postal_code: values.postal_code,
            state: values.state,
            default: values.default,
          }).unwrap();
        }

        onClose();
      } catch (e) {
        handleApiError<DeliveryAddressFormValues>(e, form);
      }
    },
    [
      createDeliveryAddressMutation,
      deliveryAddressToEdit,
      handleApiError,
      onClose,
      updateDeliveryAddressMutation,
    ],
  );

  const deliveryAddressFormInitialValues = useMemo<DeliveryAddressFormValues | undefined>(() => {
    if (deliveryAddressToEdit) {
      return {
        city: deliveryAddressToEdit.city,
        street_name: deliveryAddressToEdit.street_name,
        ap_suite: deliveryAddressToEdit.ap_suite,
        house_number: deliveryAddressToEdit.house_number,
        postal_code: deliveryAddressToEdit.postal_code,
        state: deliveryAddressToEdit.state,
        default: deliveryAddressToEdit.default,
      };
    }

    return undefined;
  }, [deliveryAddressToEdit]);

  return (
    <Modal
      contentContainerStyle={styles.modal}
      title={`${deliveryAddressToEdit ? 'Edit' : 'New'} Address`}
      visible={visible}
      onClose={onClose}
    >
      <DeliveryAddressForm
        initialValues={deliveryAddressFormInitialValues}
        loading={isLoadingCreateDeliveryAddressMutation || isLoadingUpdateDeliveryAddressMutation}
        onSubmit={handleSubmit}
      />
      {snackbar}
    </Modal>
  );
};

export const DeliveryAddressModal = memo(Component);
