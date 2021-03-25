import HCaptcha from '@hcaptcha/react-hcaptcha'
import { Ref } from 'react'

const Captcha = ({ dark, onVerify }:CaptchaProps):JSX.Element => {
	return <HCaptcha sitekey='43e556b4-cc90-494f-b100-378b906bb736' theme={dark ? 'dark' : 'light'} onVerify={onVerify}/>
}

interface CaptchaProps {
  dark: boolean
  onVerify(token: string, eKey?: string): void
  ref?: Ref<HCaptcha>
}

export default Captcha