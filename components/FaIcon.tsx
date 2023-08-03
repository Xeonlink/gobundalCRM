import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

type Props = FontAwesomeIconProps & {
  isLoading?: boolean;
  value?: string;
  loadingValue?: string;
};

export function FaIcon(props: Props) {
  const { isLoading, value: text, loadingValue: loadingText = "로딩중...", ...rest } = props;

  if (isLoading) {
    return (
      <>
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> {loadingText}
      </>
    );
  }

  return (
    <>
      <FontAwesomeIcon {...rest} /> {text}
    </>
  );
}
