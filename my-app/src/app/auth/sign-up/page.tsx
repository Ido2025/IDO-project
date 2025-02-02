import SingUpFormProvider from '@/components/forms/sing-up/form-provider'
import RegistrationFormStep from '@/components/forms/sing-up/registration-step'
import ButtonHandler from '@/components/forms/sing-up/button-handlers'
import HighLightBar from '@/components/forms/sing-up/highlight-bar'

import React from 'react'

type Props = {}

const SingUp = (props: Props) => {

  return <div className="flex-1 py-36 md:px-16 w-full">
    <div className="flex flex-col h-full gap-3">
      <SingUpFormProvider>
        <div className="flex flex-col gap-3">
          <RegistrationFormStep />
          <ButtonHandler />
        </div>
        <HighLightBar />
      </SingUpFormProvider>
    </div>
  </div>
}

export default SingUp