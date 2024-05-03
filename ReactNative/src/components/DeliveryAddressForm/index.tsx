import { zodResolver } from '@hookform/resolvers/zod';
import React, { memo, useCallback } from 'react';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { Checkbox } from '~/components/Forms/Checkbox';
import { Picker } from '~/components/Forms/Picker';
import { TextInput } from '~/components/Forms/TextInput';
import { LocationButtons } from '~/components/LocationButtons';
import { Text } from '~/components/Text';
import { STATES } from '~/constants/states';
import { DeliveryAddressFormValues } from '~/types/formValues';
import { GooglePlaceDetails } from '~/types/models';
import { DeliveryAddressFormValidationSchema } from '~/utils/formSchemas';

import { styles } from './styles';

interface Props {
  loading: boolean;
  initialValues?: DeliveryAddressFormValues;
  onSubmit: (
    form: UseFormReturn<DeliveryAddressFormValues>,
    values: DeliveryAddressFormValues,
  ) => void;
}

const Component: React.FC<Props> = ({ loading, initialValues, onSubmit }) => {
  const form = useForm<DeliveryAddressFormValues>({
    defaultValues: initialValues || {
      street_name: '',
      ap_suite: '',
      house_number: '',
      city: '',
      postal_code: '',
      state: '',
      default: false,
    },
    resolver: zodResolver(DeliveryAddressFormValidationSchema),
  });

  const handleLocationSelect = useCallback(
    (placeDetails: GooglePlaceDetails) => {
      form.setValue('street_name', placeDetails.streetName);
      form.setValue('house_number', placeDetails.houseNumber);
      form.setValue('city', placeDetails.city);
      form.setValue('postal_code', placeDetails.postcode);

      const foundState = STATES.find(state => state.value === placeDetails.state);

      if (foundState) {
        form.setValue('state', foundState.value);
      }
    },
    [form],
  );

  const handleSubmit: SubmitHandler<DeliveryAddressFormValues> = useCallback(
    values => {
      onSubmit(form, values);
    },
    [form, onSubmit],
  );

  return (
    <View>
      <LocationButtons style={styles.locationButtons} onSelect={handleLocationSelect} />
      <TextInput
        control={form.control}
        fieldStyle={styles.textInput}
        label="Street name"
        name="street_name"
      />
      <TextInput
        control={form.control}
        fieldStyle={styles.textInput}
        label="Ap / Suite"
        name="ap_suite"
      />
      <TextInput
        control={form.control}
        fieldStyle={styles.textInput}
        label="House number"
        name="house_number"
      />
      <TextInput
        control={form.control}
        fieldStyle={styles.textInput}
        label="City"
        name="city"
      />
      <TextInput
        control={form.control}
        fieldStyle={styles.textInput}
        label="Postal code"
        name="postal_code"
      />
      <Picker
        control={form.control}
        items={STATES}
        label="State"
        name="state"
      />
      <Checkbox
        control={form.control}
        fieldStyle={styles.checkboxField}
        label={<Text size="12">Set as a default</Text>}
        name="default"
        style={styles.checkbox}
      />
      <Button loading={loading} mode="contained" onPress={form.handleSubmit(handleSubmit)}>
        Save
      </Button>
    </View>
  );
};

export const DeliveryAddressForm = memo(Component);
