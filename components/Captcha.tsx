import { Ref } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'


const Captcha: React.FC<CaptchaProps> = ({ dark, onVerify }) => {
	return <HCaptcha sitekey={process.env.HCATPCHA_SITEKEY} theme={dark ? 'dark' : 'light'} onVerify={onVerify}/>
}

interface CaptchaProps {
  dark: boolean
  onVerify(token: string, eKey?: string): void
  ref?: Ref<HCaptcha>
}

export default Captcha