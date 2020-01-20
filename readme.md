# Afili8

## Description
A SaaS API for afiliate marketing. Users register, then on their site, whenever they recieve a request to a path that corresponds to a referral code, they redirect to their sale page anduse the verify functionality to check if it's a valid referral code, then they use the increment functionality to assign the completed sale to the referral code owner.

## API Usage
Endpoint | Paramaters | Description
--- | --- | ---
/api/new-client | APIToken, clientName | Used on client sign-up
/api/create | clientToken, afiliateLink | Creates a new afiliate link
/api/delete | clientToken, afiliateLink | Deletes the specified afiliate link
/api/verify | clientToken, afiliateLink | Checks if the given link is registered
/api/increment | clientToken, afiliateLink | Assigns a sale to the specified afiliate link

## Database structure
afili8
|-clients
    |-clientToken1
        |-{affiliateCode: CODE, numberUses: N}
        |-{affiliateCode: CODE, numberUses: N}
        |-{affiliateCode: CODE, numberUses: N}
    |-clientToken2
        |-{affiliateCode: CODE, numberUses: N}
        |-{affiliateCode: CODE, numberUses: N}
        |-{affiliateCode: CODE, numberUses: N}
    |-clientToken3
        |-{affiliateCode: CODE, numberUses: N}
        |-{affiliateCode: CODE, numberUses: N}
        |-{affiliateCode: CODE, numberUses: N}
    ...
    |-clientTokenN
        |-{affiliateCode: CODE, numberUses: N}
        |-{affiliateCode: CODE, numberUses: N}
        |-{affiliateCode: CODE, numberUses: N}






