import openk_client from './open-k/system.js'
import openk_wallet from './open-k/wallet.js'
import openk_data   from './open-k/data.js'

openk_client.theme.init()
openk_client.build.init()
openk_client.overlay.init()

document.getElementById('mana').addEventListener('click', async function() {
    const input = openk_wallet.getLocalWallet()
    const type  = 'mana'

    try {
        const template = await axios.get('./view/text.html')
        const data     = await openk_data.request(input, type)
        openk_client.addContent(template, data)

    } catch (error) {
        console.error('Failed [mana]:', error)
    }
})

document.getElementById('balance').addEventListener('click', async function() {
    const contract_address  = document.getElementById('contract_address').value

    try {
        const template = await axios.get('./view/text.html')
        const data     = await openk_data.request(openk_wallet.getLocalWallet(), contract_address)
        openk_client.addContent(template, data)

    } catch (error) {
        console.error('Failed [balance]:', error)
    }
})

document.getElementById('send').addEventListener('click', async function() {
    try {
        const template = await axios.get('./view/link.html')
        const result   = await axios.post('./api/send/', {}, {
            headers: {
                'Content-Type': 'application/json',
                'sender': openk_wallet.getLocalWallet(),
                'contract': '14MjxccMUZrtBPXnNkuAC5MLtPev2Zsk3N',
                'receiver': '1FuPDoEUGtmJkhQdUd1Kvjq2H6WduEQYJJ',
                'amount': '1000'
            }
        })

        console.log(result)
        
        openk_client.addContent(template, result.data)

    } catch (error) {
        console.error('Failed [send]:', error)
    }
})

/*
function serializeFormToJson(form) {
    var formData = {};
    Array.from(form.elements).forEach(element => {
        if (element.name && element.name.length) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                if (element.checked) {
                    formData[element.name] = element.value;
                }
            } else if (element.type !== 'submit') {
                formData[element.name] = element.value;
            }
        }
    });
    
    return JSON.stringify(formData);
}

// Usage
document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    
    var jsonData = serializeFormToJson(this);
    console.log(jsonData); // Log the JSON string to console
});
*/