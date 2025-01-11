import React from 'react';
import { Button } from 'react-native-paper';

const ButtonItem = ({ title, onPress, disabled }) => {
  return (
    <Button
      mode="contained"
      disabled={disabled}
      style={{ marginVertical: 8, width: '80%' }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};

export default ButtonItem;