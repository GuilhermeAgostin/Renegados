const InputArray = [
  {
    key: 0,
    variant: "standard",
    size: 'small',
    fullWidth: true,
    label: "ID",
    name: "Id",
    autoComplete: undefined,
    InputProps: undefined
  }
  , {
    key: 1,
    variant: "standard",
    size: 'small',
    fullWidth: true,
    label: "Perfil",
    name: "Id",
    autoComplete: undefined,
    InputProps: undefined
  }
  , {
    key: 2,
    variant: "standard",
    size: 'small',
    fullWidth: true,
    label: "Cod SAP",
    name: "Id",
    autoComplete: undefined,
    InputProps: undefined
  }
  , {
    key: 3,
    variant: "standard",
    size: 'small',
    fullWidth: true,
    label: "Usuário",
    name: "Id",
    autoComplete: undefined,
    InputProps: undefined
  }
  , {
    key: 4,
    variant: "standard",
    size: 'small',
    fullWidth: true,
    label: "Senha",
    name: "Id",
    autoComplete: undefined,
    InputProps: undefined
  }
  , {
    key: 5,
    variant: "standard",
    size: 'small',
    fullWidth: true,
    label: "Status",
    name: "Id",
    autoComplete: undefined,
    InputProps: undefined,
    ShouldBeSwitch: true
  }
]

const Strings = {
  NEW_USER: 'Novo Usuário'
  , SUB_TITLE_TEXT:'Dados Básicos'
  , NEXT_STEP: 'Próxima Etapa'
  , OLD_STEP: 'Etapa Anterior'
  , CANCEL: 'Cancelar Cadastro'
}

const Steps = ['Dados Básicos', 'Complementares', 'Endereço']

export const Setup = {
  InputArray
  , Strings
  , Steps
}