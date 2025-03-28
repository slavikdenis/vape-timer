import { FormLabel } from '@chakra-ui/react';
import { memo } from 'react';

const SettingsSectionTitle = ({ title }: { title: string }) => (
  <FormLabel mb={4} as="h3" fontSize="xl">
    {title}
  </FormLabel>
);

export default memo(SettingsSectionTitle);
