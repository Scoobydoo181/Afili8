# Afili8

## Description
A SaaS API for affiliate marketing. Users register, then on their site, whenever they recieve a request to a path that corresponds to a referral code, they redirect to their sale page and use the verify functionality to check if it's a valid referral code, then they use the increment functionality to assign the completed sale to the referral code owner.

## API Usage
Endpoint | Paramaters | Description
--- | --- | ---
/api/new-client | APIToken, clientName | Used on client sign-up
/api/create | clientToken, affiliateLink | Creates a new affiliate link
/api/delete | clientToken, affiliateLink | Deletes the specified affiliate link
/api/verify | clientToken, affiliateLink | Checks if the given link is registered
/api/increment | clientToken, affiliateLink | Assigns a sale to the specified affiliate link

## Database structure
```afili8
    |-clients
        |-clientToken1
            |-{firstName: FIRST, lastName: LAST, email: EMAIL, password: PASSWORDHASH}
            |-transactions
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                ...
            |-{affiliateCode: CODE, numberUses: N}
            |-{affiliateCode: CODE, numberUses: N}
            |-{affiliateCode: CODE, numberUses: N}
            ...
        |-clientToken2
            |-{firstName: FIRST, lastName: LAST, email: EMAIL, password: PASSWORDHASH}
            |-transactions
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                ...
            |-{affiliateCode: CODE, numberUses: N}
            |-{affiliateCode: CODE, numberUses: N}
            |-{affiliateCode: CODE, numberUses: N}
            ...
        |-clientToken3
            |-{firstName: FIRST, lastName: LAST, email: EMAIL, password: PASSWORDHASH}
            |-transactions
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                ...
            |-{affiliateCode: CODE, numberUses: N}
            |-{affiliateCode: CODE, numberUses: N}
            |-{affiliateCode: CODE, numberUses: N}
            ...
        ...
        |-clientTokenN
            |-{firstName: FIRST, lastName: LAST, email: EMAIL, password: PASSWORDHASH}
            |-transactions
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                |-{date: DATEOBJ, affiliateCode: CODE, price: PRICE, commission: COMMISSION}
                ...
            |-{affiliateCode: CODE, numberUses: N}
            |-{affiliateCode: CODE, numberUses: N}
            |-{affiliateCode: CODE, numberUses: N}
            ...```






