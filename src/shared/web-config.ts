const configs: WebConfig[] = [
    {
        Name: 'Instant eats',
        Base: 'instanteats.co.za',
        PhoneBanner: 'assets/images/phone-logo.png',
        Logo: './assets/icons/icon-192x192.png',
        Loader: 'assets/images/loader.png',
        SearchPlaceHolder: 'Search Restaurants or Food cuisines',
        Heading: 'Discover , Order & Enjoy food',
        WebCatergoryName: 'Restaurants',
        WebCatergoryNameSingular: 'Restaurant',
        SubHeading: 'Instant eats is the best way to get food from your favorite local restaurants. Get it delivered to you warm & fresh.',
        BackgroundColor: '#F3BB1C',
        Email: 'info@instanteats.co.za',
        ComplementaryColor: '#000000',
        ProductName: 'Food',
        MerchantId : '17194710',
        MerchantKey : 'tqcl4iesooa66',
        ShopLinkName: 'restaurant'
    },
    {
        Name: 'Agri Farmer',
        Base: 'agrifarmer.africa',
        Email: 'info@agrifarmer.africa',
        PhoneBanner: 'assets/images/agri-phone-banner.png',
        Logo: './assets/icons/icon-192x192.png',
        Loader: 'assets/images/agri-loader.png',
        SearchPlaceHolder: 'Search Farmers or Products',
        Heading: 'Fresh organic food delivered to your door',
        WebCatergoryName: 'Farmers',
        WebCatergoryNameSingular: 'Farmer',
        SubHeading: 'We deliver organic fruits & vegetables fresh from our fields to your doorstep.',
        BackgroundColor: '#23830D',
        ComplementaryColor: '#FFFFFF',
        ProductName: 'Product',
        MerchantId : '17417116',
        MerchantKey : 'otj8axklnmys8',
        ShopLinkName: 'farmer'

    }
]
export function getConfig(base): WebConfig {
    return configs.find(x => x.Base === base);
}

export interface WebConfig {
    Name: string;
    Base: string;
    PhoneBanner: string;
    Loader: string;
    Logo: string;
    Heading: string;
    SubHeading: string;
    SearchPlaceHolder: string;
    WebCatergoryName: string;
    ProductName: string;
    WebCatergoryNameSingular: string;
    BackgroundColor: string;
    ComplementaryColor: string;
    MerchantId: string;
    MerchantKey: string;
    Email: string;
    ShopLinkName: string;

}
