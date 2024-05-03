import React, { useCallback, useRef, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import LocationIcon from '~/assets/icons/location-outline.svg';
import PlusIcon from '~/assets/icons/plus-in-circle.svg';
import DeliveryAddressImage from '~/assets/images/delivery-address.svg';
import { Button } from '~/components/Button';
import { Checkbox } from '~/components/Checkbox';
import { ConfirmModal } from '~/components/ConfirmModal';
import { DeliveryAddressModal } from '~/components/DeliveryAddressModal';
import { Screen } from '~/components/Screen';
import { Text } from '~/components/Text';
import { useErrorHandler } from '~/hooks/useErrorHandler';
import { ProfileStackScreenProps } from '~/navigator/stacks/ProfileStack';
import {
  useDeleteDeliveryAddressMutation,
  useGetDeliveryAddressesQuery,
  useUpdateDeliveryAddressMutation,
} from '~/services/rtkQuery/user';
import { colors } from '~/styles/theme';
import { DeliveryAddress } from '~/types/models';
import { formatDeliveryAddress } from '~/utils/deliveryAddress';

import { styles } from './styles';

export const DeliveryAddresses: React.FC<ProfileStackScreenProps<'DeliveryAddresses'>> = () => {
  const { handleApiError, snackbar } = useErrorHandler();
  const getDeliveryAddressesQuery = useGetDeliveryAddressesQuery();
  const [deleteDeliveryAddressMutation, { isLoading: isLoadingDeleteDeliveryAddressMutation }] =
    useDeleteDeliveryAddressMutation();
  const [updateDeliveryAddressMutation, { isLoading: isLoadingUpdateDeliveryAddressMutation }] =
    useUpdateDeliveryAddressMutation();
  const [deliveryAddressModalVisible, setDeliveryAddressModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const activeDeliveryAddress = useRef<DeliveryAddress | null>(null);

  const showDeliveryAddressModal = useCallback(() => {
    setDeliveryAddressModalVisible(true);
  }, []);

  const hideDeliveryAddressModal = useCallback(() => {
    activeDeliveryAddress.current = null;

    setDeliveryAddressModalVisible(false);
  }, []);

  const showConfirmDeleteModal = useCallback((deliveryAddress: DeliveryAddress) => {
    activeDeliveryAddress.current = deliveryAddress;

    setConfirmDeleteModalVisible(true);
  }, []);

  const hideConfirmDeleteModal = useCallback(() => {
    activeDeliveryAddress.current = null;

    setConfirmDeleteModalVisible(false);
  }, []);

  const handleDefaultDeliveryAddressChange = useCallback(
    async (id: number, makeDefault: boolean) => {
      try {
        await updateDeliveryAddressMutation({ id, default: makeDefault }).unwrap();
      } catch (e) {
        handleApiError(e);
      }
    },
    [handleApiError, updateDeliveryAddressMutation],
  );

  const handleDeliveryAddressDelete = useCallback(async () => {
    try {
      if (activeDeliveryAddress.current) {
        await deleteDeliveryAddressMutation({
          id: activeDeliveryAddress.current.id,
        }).unwrap();

        hideConfirmDeleteModal();
      }
    } catch (e) {
      handleApiError(e);
    }
  }, [deleteDeliveryAddressMutation, handleApiError, hideConfirmDeleteModal]);

  const handleDeliveryAddressEdit = useCallback(
    (deliveryAddress: DeliveryAddress) => {
      activeDeliveryAddress.current = deliveryAddress;

      showDeliveryAddressModal();
    },
    [showDeliveryAddressModal],
  );

  const renderItem: ListRenderItem<DeliveryAddress> = useCallback(
    ({ item }) => {
      const formattedDeliveryAddress = formatDeliveryAddress(item);

      return (
        <View style={styles.deliveryAddress}>
          <View style={styles.deliveryAddressInfo}>
            <LocationIcon
              color={`rgb(${colors.text1})`}
              height={24}
              style={styles.locationIcon}
              width={24}
            />
            <View>
              <Text size="16" style={styles.deliveryAddressStreet} weight="500">
                {formattedDeliveryAddress.street}
              </Text>
              <Text size="14">{formattedDeliveryAddress.city}</Text>
            </View>
          </View>
          <View style={styles.horizontalSeparator} />
          <View style={styles.deliveryAddressActions}>
            <Checkbox
              checked={item.default}
              label={
                <Text size="12" style={styles.defaultCheckboxLabel}>
                  Set as a default
                </Text>
              }
              style={styles.defaultCheckbox}
              onChange={checked => handleDefaultDeliveryAddressChange(item.id, checked)}
            />
            <View style={styles.deliveryAddressButtons}>
              <Button
                labelStyle={styles.deliveryAddressButtonLabel}
                onPress={() => showConfirmDeleteModal(item)}
              >
                Delete
              </Button>
              <View style={styles.verticalSeparator} />
              <Button
                labelStyle={styles.deliveryAddressButtonLabel}
                onPress={() => handleDeliveryAddressEdit(item)}
              >
                Edit
              </Button>
            </View>
          </View>
        </View>
      );
    },
    [handleDefaultDeliveryAddressChange, handleDeliveryAddressEdit, showConfirmDeleteModal],
  );

  const keyExtractor = useCallback((item: DeliveryAddress) => item.id.toString(), []);

  const ItemSeparator = useCallback(() => {
    return <View style={styles.deliveryAddressSeparator} />;
  }, []);

  const loading = getDeliveryAddressesQuery.isFetching || isLoadingUpdateDeliveryAddressMutation;

  const emptyScreen = !getDeliveryAddressesQuery.data?.data.length || loading;

  return (
    <Screen
      style={emptyScreen ? styles.screenEmpty : styles.screen}
      withHorizontalPadding={emptyScreen}
    >
      {loading ? (
        <ActivityIndicator size="large" />
      ) : getDeliveryAddressesQuery.data?.data.length ? (
        <>
          <FlatList
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.flatList}
            data={getDeliveryAddressesQuery.data.data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
          <Button
            mode="contained"
            style={styles.addButtonContained}
            onPress={showDeliveryAddressModal}
          >
            Add a new address
          </Button>
        </>
      ) : (
        <>
          <DeliveryAddressImage style={styles.image} />
          <Text size="16">The delivery addresses is still empty.</Text>
          <Button
            icon={PlusIcon}
            mode="outlined"
            style={styles.addButtonOutlined}
            onPress={showDeliveryAddressModal}
          >
            Add New Address
          </Button>
        </>
      )}
      <DeliveryAddressModal
        deliveryAddressToEdit={activeDeliveryAddress.current || undefined}
        visible={deliveryAddressModalVisible}
        onClose={hideDeliveryAddressModal}
      />
      <ConfirmModal
        cancelText="Cancel"
        confirmText="Delete address"
        loading={isLoadingDeleteDeliveryAddressMutation}
        title="Are you sure you want to delete this address?"
        visible={confirmDeleteModalVisible}
        onCancel={hideConfirmDeleteModal}
        onConfirm={handleDeliveryAddressDelete}
      />
      {snackbar}
    </Screen>
  );
};
