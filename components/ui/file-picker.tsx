import { Input, InputGroup, InputGroupProps } from "@chakra-ui/input"
import { Button, ButtonProps, InputRightAddon } from "@chakra-ui/react"
import React, { MutableRefObject, useRef } from "react"
import PropTypes from "prop-types"

interface FilePickerProps {
  onFileChange: (fileList: Array<File> | null) => void
  placeholder: string
  clearButtonLabel?: string
  hideClearButton?: boolean
  multipleFiles?: boolean
  accept?: string
  inputProps?: InputGroupProps
  inputGroupProps?: InputGroupProps
  buttonProps?: ButtonProps
}

export const FilePicker = (props: FilePickerProps) => {
  const inputRef = useRef<HTMLInputElement>()

  const handleOnFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = []
    if(ev.target.files) {
      for (const file of ev.target.files) {
        fileList.push(file)
      }
      props.onFileChange(fileList)
    }
  }

  const handleOnClearClick = () => {
    clearInnerInput()
  }

  const clearInnerInput = () => {
    if (inputRef?.current) {
      inputRef.current.value = ""
    }
  }

  const handleOnInputClick = () => {
    if (inputRef?.current) {
      inputRef.current.value = ""
      inputRef.current.click()
    }
  }

  const {
    placeholder,
    clearButtonLabel,
    hideClearButton,
    multipleFiles,
    accept,
    inputProps,
    inputGroupProps,
  } = props

  return (
    <InputGroup {...inputGroupProps}>
      <input
        type="file"
        ref={inputRef as MutableRefObject<HTMLInputElement>}
        accept={accept}
        style={{ display: "none" }}
        multiple={multipleFiles}
        onChange={handleOnFileChange}
        data-testid={inputProps?.placeholder ?? placeholder}
      />
      <Input
        placeholder={placeholder}
        cursor="pointer"
        {...{
          ...inputProps,
          readOnly: true,
          isReadOnly: true,
          onClick: handleOnInputClick,
        }}
      />
      {!hideClearButton && (
        <ClearButton
          clearButtonLabel={clearButtonLabel ?? "Clear"}
          onButtonClick={handleOnClearClick}
        />
      )}
    </InputGroup>
  )
}

type ClearButtonProps = Pick<
  FilePickerProps,
  "clearButtonLabel" | "buttonProps"
> & {
  onButtonClick: () => void
}

const ClearButton: React.FC<ClearButtonProps> = ({
  clearButtonLabel,
  onButtonClick,
  buttonProps,
}) => (
  <InputRightAddon>
    <Button {...buttonProps} onClick={onButtonClick}>
      {clearButtonLabel ?? "Clear"}
    </Button>
  </InputRightAddon>
)

ClearButton.propTypes = {
  clearButtonLabel: PropTypes.string,
  onButtonClick: PropTypes.func.isRequired,
  buttonProps: PropTypes.object,
}

export default FilePicker
