export class DeeplDataProvider {

    private _apiKey: string;

    constructor(apiKey: string) {
        this._apiKey = apiKey;
    }

    private POST(url: string, data: any) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${this._apiKey}`,
                'User-Agent': 'YourApp/1.2.3',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    }

    public translateText(text: string, targetLang: string) {
        const url = 'https://api-free.deepl.com/v2/translate';

        const data = {
            text: [text],
            target_lang: targetLang
        };

        return this.POST(url, data)
            .then(data => {
                console.log(data.translations[0].text)
                return data.translations[0].text;
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }
}
