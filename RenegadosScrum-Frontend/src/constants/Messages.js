const WhatsappUrl = 'https://web.whatsapp.com/send?phone=55'
const Messages = [
    'Olá! Prazer, somo do iJob! Notamos que o(a) senhor(a) não se encontra no local do pedido, gostaríamos de dar uma resposta ao cliente, você está a caminho?',
    , ''
]
export function GetWhatsAppLink(Phone, MessageType = 1, CustomMessage = undefined) {
    let newCustomMessage = ''

    if (CustomMessage != undefined) {
        newCustomMessage = CustomMessage.replaceAll(' ', '%20')
    }
    else {
        newCustomMessage = Messages[MessageType]

        newCustomMessage = newCustomMessage.replaceAll(' ', '%20')
    }

    return `${WhatsappUrl}${Phone}&text=${newCustomMessage}`
}