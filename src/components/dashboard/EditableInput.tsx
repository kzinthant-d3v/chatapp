import {useCallback, useState} from 'react';
import {Alert, Icon, Input, InputGroup} from 'rsuite';

interface EInputProps {
  initialValue: string;
  onSave: (newData: any) => void;
  label?: JSX.Element;
  placeholder?: string;
  name: string;
  emptyMsg?: string;
  inputProps?: any;
  wrapperClassName?: string;
}

export default function EditableInput({
  name,
  initialValue,
  onSave,
  label,
  placeholder = 'Write your value',
  emptyMsg = 'Input is empty',
  wrapperClassName = '',
  ...inputProps
}: EInputProps) {
  const [input, setInput] = useState(initialValue);
  const [isEdit, setIsEdit] = useState(false);

  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const onEditClick = useCallback(() => {
    setIsEdit((p) => !p);
    setInput(initialValue);
  }, [initialValue]);

  const onSaveClick = async () => {
    const trimmed = input.trim();
    if (trimmed === '') {
      Alert.info(emptyMsg, 4000);
    }
    if (trimmed !== initialValue) {
      await onSave(trimmed);
    }
    setIsEdit(false);
  };

  return (
    <div className={wrapperClassName}>
      {label}
      <InputGroup>
        <Input
          {...inputProps}
          disabled={!isEdit}
          placeholder={placeholder}
          onChange={onInputChange}
          value={input}
        />
        <InputGroup.Button onClick={onEditClick}>
          <Icon icon={isEdit ? 'close' : 'edit2'} />
        </InputGroup.Button>
        {isEdit && (
          <InputGroup.Button onClick={onSaveClick}>
            <Icon icon="check" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
}
