export interface Simbolo {
    nombre: string;
}

export interface SimboloDetalle {
    symbol: string;
    base_currency: string;
    quote_currency: string;
    tick_size: number;
    quote_increment: number;
    min_order_size: string;
    status: string;
    wrap_enabled: boolean;
    product_type: string;
    contract_type: string;
    contract_price_currency: string;
}

export interface Precio {
    pair: string;
    price: string;
    percentChange24h: string;
}

export interface Trade {
    timestamp: number;
    timestampms: number;
    tid: number;
    price: string;
    amount: string;
    exchange: string;
    type: 'buy' | 'sell';
    broken?: boolean;
}
