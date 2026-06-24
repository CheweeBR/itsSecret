import { Dialog } from 'radix-ui'

export function ExampleDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-flex min-h-11 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white active:bg-violet-700">
        Abrir diálogo
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-30 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none dark:bg-neutral-900">
          <Dialog.Title className="text-lg font-semibold">Olá 👋</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-neutral-500">
            Este é um Dialog acessível do Radix, estilizado com Tailwind. Fecha com
            Esc, clique fora, ou no botão abaixo.
          </Dialog.Description>
          <div className="mt-5 flex justify-end">
            <Dialog.Close className="inline-flex min-h-11 items-center rounded-lg bg-neutral-100 px-4 text-sm font-medium dark:bg-neutral-800">
              Fechar
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
