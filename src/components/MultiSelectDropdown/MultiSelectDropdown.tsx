import React, { useRef } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface MultiSelectDropdownProps {
  options: Array<{ label: string; value: string }>;
  onChange?: (selectedValues: string[]) => void;
  onRemove?: (removedValue: string) => void;
  isDisabled: boolean;
  value?: string[];
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, onChange, onRemove, isDisabled, value }) => {
  const prevSelected = useRef<typeof options>([]);

  return (
    <Select
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state.isDisabled ? '#e2e8f0' : '#cbe5d1',
          borderWidth: '1px',
          borderRadius: '6px',
          boxShadow: 'none',
          minHeight: '40px',
          width: '270px',
          // cursor: state.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
          backgroundColor: state.isDisabled ? 'white' : '#f1f5f9',
          '&:hover': {
            borderColor: '#94a3b8',
          },
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          color: '#64748b',
          fontSize: '13px',
          fontWeight: 'normal',
        }),
        dropdownIndicator: (baseStyles) => ({
          ...baseStyles,
          color: '#64748b',
          '&:hover': {
            color: '#475569',
          },
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: '13px',
          backgroundColor: state.isSelected ? '#f1f5f9' : 'white',
          color: '#020617',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
          padding: '4px 16px',
        }),
        multiValue: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: '#e2e8f0',
          borderRadius: '6px',
        }),
        multiValueLabel: (baseStyles) => ({
          ...baseStyles,
          color: '#1e293b',
          fontSize: '13px',
          padding: '2px 4px',
        }),
        multiValueRemove: (baseStyles) => ({
          ...baseStyles,
          color: '#64748b',
          '&:hover': {
            backgroundColor: '#e2e8f0',
            color: '#475569',
          },
        }),
      }}
      isDisabled={isDisabled}
      placeholder="Select payment method"
      closeMenuOnSelect={true}
      options={options}
      components={animatedComponents}
      isMulti
      value={value ? options.filter(option => value.includes(option.value)) : undefined}
      onChange={(selected: typeof options) => {
        const newValues = selected.map((option) => option.value);

        // Detect removed items
        if (onRemove) {
          const removed = prevSelected.current.filter((prevOption) => !newValues.includes(prevOption.value));
          removed.forEach((option) => onRemove(option.value));
        }

        if (onChange) onChange(newValues);
        prevSelected.current = selected || [];
      }}
    />
  );
};

export default MultiSelectDropdown;
