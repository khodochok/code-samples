import { StyleSheet } from 'react-native';

import { styles as textStyles } from '~/components/Text/styles';
import { colors, layout } from '~/styles/theme';

export const styles = StyleSheet.create({
  screen: {
    paddingBottom: 20,
  },
  screenEmpty: {
    paddingTop: 90,
    alignItems: 'center',
  },
  image: {
    marginBottom: 80,
  },
  addButtonOutlined: {
    width: '100%',
    marginTop: 24,
    borderStyle: 'dashed',
    backgroundColor: `rgba(${colors.background5}, 0.8)`,
  },
  addButtonContained: {
    marginTop: 24,
    marginHorizontal: layout.padding,
  },
  flatList: {
    paddingTop: 32,
    paddingHorizontal: layout.padding,
  },
  deliveryAddress: {
    borderRadius: 4,
    padding: 16,
    backgroundColor: `rgb(${colors.background7})`,
  },
  deliveryAddressInfo: {
    flexDirection: 'row',
  },
  locationIcon: {
    marginRight: 8,
  },
  deliveryAddressStreet: {
    marginBottom: 4,
  },
  horizontalSeparator: {
    height: 1,
    backgroundColor: `rgb(${colors.border6})`,
    marginVertical: 12,
  },
  deliveryAddressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultCheckbox: {
    alignItems: 'center',
  },
  defaultCheckboxLabel: {
    color: `rgba(${colors.black}, 0.87)`,
  },
  deliveryAddressButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryAddressButtonLabel: {
    color: `rgba(${colors.black}, 0.87)`,
    textDecorationLine: 'none',
    ...textStyles.weight400,
    ...textStyles.size12,
  },
  verticalSeparator: {
    width: 1,
    height: 15,
    marginHorizontal: 12,
    backgroundColor: `rgb(${colors.border6})`,
  },
  deliveryAddressSeparator: {
    height: 24,
  },
});
