import {ProductScanCommand} from "../commands/ProductScanCommand";
import {BaseCommandService, ICommand, IEvent, IState, IStore} from "../../../../escore/build";
import {ProductScanHandler} from "../handlers/ProductScanHandler";


export class ProductService extends BaseCommandService<ICommand, IEvent, IState> {


    constructor(store: IStore) {
        super(store)
    }

/*    public async createUser(email: string, password: string, role: number) {
        const c: ProductScanCommand = {
            email: email, password: password, role: role
        }
        this.commandHandler = new ProductScanHandler()
        this.projector = new UserCreateProjector()
        return this.execute(c);
    }*/

    public async scanned(c: ProductScanCommand ) {
        this.commandHandler = new ProductScanHandler()
        return this.execute(c)
    }




    }