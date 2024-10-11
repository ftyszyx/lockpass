import { use_appset } from '@renderer/models/appset.model'

export function Header() {
  const isVaultChangeNotBackup = use_appset((state) => state.IsVaultChangeNotBackup)
  const getText = use_appset((state) => state.getText)
  const getappset = use_appset((state) => state.getAppSet)
  const nobackupwarn = isVaultChangeNotBackup()
  const getFooterText = () => {
    const appset = getappset()
    if (appset?.cur_use_backup_info) {
      const time = new Date(appset.cur_use_backup_info.time)
      return getText(
        'footer.curbackup',
        appset.cur_use_backup_info.drive_type,
        appset.cur_use_backup_info.file_name,
        time.toLocaleString()
      )
    }
    return getText('footer.normalinfo', new Date().toLocaleDateString())
  }
  return (
    <div className=" flex flex-row font-sans text-[var(--header-height)] items-center text-center h-[var(--header-height)]">
      {nobackupwarn && (
        <div className="w-full bg-red-500 text-white ">
          <p>{getText('admin_about.vault_change_not_backup')}</p>
        </div>
      )}
      {!nobackupwarn && (
        <div className="w-full text-green-500 bg-green-100 ">
          <div
            className="text-blue-400"
            dangerouslySetInnerHTML={{ __html: getFooterText() }}
          ></div>
        </div>
      )}
    </div>
  )
}
