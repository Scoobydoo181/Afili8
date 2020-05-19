# Afili8

## Description
A API for affiliate marketing. Business owners register, then on their site whenever they recieve a request to a path that corresponds to a referral code, they redirect to their sale page and use the verify endpoint to check if it's a valid referral code, then they use the increment endpoint to assign the completed sale to the referral code owner.

## API Usage
Endpoint | Paramaters | Description
--- | --- | ---
/api/new-client | APIToken, clientName | Used on client sign-up
/api/create | clientToken, affiliateLink | Creates a new affiliate link
/api/delete | clientToken, affiliateLink | Deletes the specified affiliate link
/api/verify | clientToken, affiliateLink | Checks if the given link is registered
/api/increment | clientToken, affiliateLink | Assigns a sale to the specified affiliate link

## NodeJS Wrapper Library

```
const afili8 = new require('afili8')(YOUR_UNIQUE_TOKEN)

afili8.create('AFFILIATE_CODE_1')
afili8.create('AFFILIATE_CODE_2')
afili8.create('AFFILIATE_CODE_3')

afili8.verify('AFILIATE_CODE_2') // -> true

afili8.delete('AFFILIATE_CODE_2')

afili8.verify('AFILIATE_CODE_2') // -> false

let price = 29.99
let commission = 4.99
afili8.increment('AFILIATE_CODE_1', price, commission)
```





