import {ProductScanCommand} from "../commands/ProductScanCommand";
import {BaseCommandService, ICommand, IEvent, IState, IStore} from "../../../../escore/build";
import {ProductScanHandler} from "../handlers/ProductScanHandler";


export class ProductService extends BaseCommandService<ICommand, IEvent, IState> {


    constructor(store: IStore) {
        super(store)
    }

    public async scanned(c: ProductScanCommand ) {
        this.commandHandler = new ProductScanHandler()
        return this.execute(c)
    }




    }