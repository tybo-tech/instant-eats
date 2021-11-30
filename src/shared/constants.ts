import { HomeTabModel } from "src/models/UxModel.model";
export const NOTIFY_EMAILS = 'mrnnmthembu@gmail.com';
export const CC_EMAILS = 'mrnnmthembu@gmail.com';
// export const NOTIFY_EMAILS = 'mrnnmthembu@gmail.com,orders@instanteats.co.za';

export const ACTIVEORDERS = 1;
export const HISTORYORDERS = 2;
export const PENDINGORDERS = 3;

export const COMMISSION_MODES = ['Fixed Fee', 'Percentage'];
export const DELIVERY_MODES = ['Self Pickup & Delivery', 'Self Pickup only', 'Delivery Only'];
export const ORDER_ACCEPTING_MODES = ['Accepting Orders', 'Not Accepting Orders'];
export const VERSION = '1.40';
export const CUSTOMER = 'Customer';
export const DRIVER = 'Driver';
export const COMPANY_EMIAL = 'info@Instanteats.co.za, accounts@tybo.co.za, mrnnmthembu@gmail.com';
export const IMAGE_CROP_SIZE = 700;
export const ADMIN = 'Admin';
export const SUPER = 'Super';
export const SYSTEM = 'System';
export const IMAGE_DONE = 'assets/images/done.svg';
export const IMAGE_ERROR = 'assets/images/error.svg';
export const IMAGE_WARN = 'assets/images/warn.svg';
export const TIMER_LIMIT_WAIT = 1000;
export const JOB_MATERIAL = 'Material';
export const JOB_LABOUR = 'Labour';
export const JOB_MAKUP = 'Markup';
export const JOB_TYPE_INTERNAL = 'Internal';
export const JOB_TYPE_CUSTOM = 'Custom';
export const ORDER_TYPE_SALES = 'Invoice';
export const ORDER_TYPE_QOUTE = 'Quote';
export const STOCK_CHANGE_INCREASE = 'Increase';
export const STOCK_CHANGE_DECREASE = 'Decrease';
export const PRODUCT_TYPE_STOCK = 'Stock product';
export const PRODUCT_TYPE_JIT = 'Just in time';
export const PRODUCT_ORDER_LIMIT_MAX = 999999;
export const INTERRACTION_TYPE_LIKE = 'Like';
export const INTERRACTION_TYPE_CHAT = 'Chat';
export const COMPANY_DESCRIPTION = 'Hey there! I am using Instant Eats.';


export const SEND_EMAIL_RESET_PASSWORD = 'https://instanteats.co.za/api/api/email/email-reset-password-link.php';
export const SEND_EMAIL_ACTIVATE_ACCOUNT = 'https://instanteats.co.za/api/api/email/email-welcome-activate-account.php';
export const SEND_EMAIL_GENERAL_TEXT = 'https://instanteats.co.za/api/api/email/general-email.php';
export const SEND_EMAIL_GENERAL_RANGE_TEXT = 'https://instanteats.co.za/api/api/email/general-email-range.php';
export const SEND_EMAIL_BILLING = 'https://instanteats.co.za/api/api/email/email-billing.php';

export const COMMON_CONN_ERR_MSG = 'it looks like there is an internet connection problem.';
export const STATUS_DELETED = 99;
export const STATUS_PENDING_PAYMENTS = 5;
export const STATUS_ACTIIVE = 1;
export const STATUS_ACTIIVE_STRING = 'Active';
export const STATUS_TRASHED_STRING = 'Trashed';
export const STATUS_PENDING_EMAIL_VERIFICATION = 4;
export const DEFAULT_DATE = '0000-00-00 00:00:00';

export const GET_PRODUCTS_URL = `api/product/get-products.php`;
export const GET_PRODUCTS_FOR_SHOP_URL = `api/product/get-products-for-shop.php`;
export const SEARCH_PRODUCTS_FOR_SHOP_URL = `api/product/search-product.php
`;
export const GET_PRODUCT_URL = `api/product/get-product.php`;
export const GET_ALL_PRODUCT_URL = `api/product/get-all-products.php`;

export const GET_USERS_URL = `api/user/get-users.php`;
export const GET_ALL_USERS_URL = `api/user/get-all-users.php`;
export const GET_REFFERALS_URL = `api/user/get-my-refferals.php`;
export const GET_USER_URL = `api/user/get-user.php`;
export const UPDATE_USER_URL = `api/user/update-user.php`;
export const ADD_USER_URL = `api/user/add-user.php`;
export const ADD_USER_COMPANY_URL = `api/user/add-user-company.php`;

export const GET_CUSTOMERS_URL = `api/customer/get-customers.php`;
export const GET_CUSTOMER_URL = `api/customer/get-customer.php`;
export const GET_CUSTOMER_BY_COMPANY_AND_EMAIL_URL = `api/customer/get-customer-by-comapny-and-email.php`;
export const UPDATE_CUSTOMER_URL = `api/customer/update-customer.php`;
export const ADD_CUSTOMER_URL = `api/customer/add-customer.php`;

export const GET_ORDERS_BY_USER_ID_URL = `api/orders/get-orders-by-user.php`;
export const GET_ORDERS_URL = `api/orders/get-orders.php`;
export const GET_ORDER_URL = `api/orders/get-order-by-id.php`;
export const ADD_ORDER_URL = `api/orders/add-order.php`;
export const PRINT_URL = `api/pdf/inv/i-2.php`;
export const UPDATE_ORDER_URL = `api/orders/update-order.php`;
export const MATRIX = 'AIzaSyAgF_rjFn7TwCCNpYP-BqdmuaLsQ8T013A';

export const DISCOUNT_GROUP = ['Automatically Apply The Discount.', 'Customer Must Enter Promo Code'];
export const DISCOUNT_TYPES = ['Percentage Off', 'Fixed Amount Off', 'Free Shipping'];

export const DISCOUNT_APPLIES_TO = ['All Products', 'Specific Products']; //, 'Specific Collections'
export const DISCOUNT_MIN_RQS = ['No Minimum Requirements', 'Minimum Purchase Amount', 'Minimum Purchase Quantity'];
export const CURRENCY = 'ZAR';
export const COMPANY_TYPE = 'FastFood';
export const MAX_PAGE_SIZE = 20;
export const INVALID_USER_LOGIN = 'Invalid Request';
export const USER_ALREADY_EXISTS = 'user already exists';
export const PASSWORD_INCORRECT = "Password incorrect";
export const TABS: HomeTabModel[] = [

    {
        Name: `Discover Food`,
        Classes: [''],
    },
    {
        Name: 'Discover shops',
        Classes: [''],
    }
];


export const ORDER_STATUSES = ['Pending','Accepted', 'Preparing', 'Ready to be picked','On the way', 'Delivered', 'Cancelled'];
export const SENDING_ORDER = 'Sending order to the restaurant please wait';
export const PLACING_ORDER = 'Placing your order'; //https://www.youtube.com/watch?v=EJoBrAFjsa8
export function ORDER_CONFIRMED_ORDER(time: string) { return `Order  confirmed for delivery in ${time} minutes`; }

export const DRIVER_TABS = [{ Name: 'Pending', Class: ['active'] }, { Name: 'Active', Class: [''] }, { Name: 'History', Class: [''] }, { Name: 'Cancelled', Class: [''] }];
export const ORDER_TABS = [{ Id: 3, Name: 'Pending', Class: ['active'] }, { Id: 1, Name: 'Active', Class: [''] }, { Id: 2, Name: 'History', Class: [''] }, { Id: 0, Name: 'Cancelled', Class: [''] }];
export const ORDER_PAYMENT_STATUSES = [
    {
        ShortName: 'Cash on delivery',
        Name: 'CASH ORDER PENDING PAYMENT',
        Class: ['active']
    }
];

export const VARIATION_SELECTION_MODES = [{ Name: 'Customer can select only one', Class: ['active'] }, { Name: 'Customer can select many', Class: [] }];
export const VARIATION_PRICE_MODES = [{ Name: 'Base price', Class: ['active'] }, { Name: 'Additional price', Class: [] }];
export const PRODUCTS_MODES = [{ Id: 1, Name: 'Product Info', Class: ['active'] }, { Id: 2, Name: 'Product Variations', Class: [] }];
export const COMPANY_TABS = [{ Id: 1, Name: 'Restaurant Info', Class: ['active'] }, { Id: 2, Name: 'Operating Hours', Class: [] }];
export const VARIATION_REQUIRED_MODES = [{ Id: 1, Name: 'Required', Class: ['active'] }, { Id: 2, Name: 'Optional', Class: [] }];
export const VIHICLES = [{ Id: 1, Name: 'Motorbike', Class: ['active'] }, { Id: 2, Name: 'Car', Class: [] }];
export const GENDER = [{ Id: 1, Name: 'Female', Class: ['active'] }, { Id: 2, Name: 'Male', Class: [] }, { Id: 3, Name: 'Rather not say', Class: [] }];
export const VARIATION_NUMBER_OF_SELECTION = [
    { Id: 1, Name: 'Only one', Class: ['active'] },
    { Id: 6, Name: 'Many', Class: [] },
];


export const OPEN_CLOSE = [{ Id: 1, Name: 'Open', Class: ['active'] }, { Id: 2, Name: 'Closed', Class: [] }];


export const YOUR_API_KEY = 'AIzaSyAd_7TDEANElRfne8E2Goj3XNIAZFHkXCQ'