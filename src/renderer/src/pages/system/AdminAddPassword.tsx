import { VaultItem } from "@common/entitys/vault_item.entity"
import { ModalType } from "@common/gloabl"
import { AppStore, use_appstore } from "@renderer/models/app.model"

interface AdminAddPasswordProps {
    show: boolean
    title:string
    show_type:ModalType 
    edit_info?:VaultItem 
    onOk?: () => Promise<void>
    onClose?: () => void
    onDelOk?: () => Promise<void>
}
export default function AdminAddPassword(props:AdminAddPasswordProps): JSX.Element {
    const appstore = use_appstore() as AppStore 

    return (

    )
}