

export default {
    id: "tables:AddRow",
    name: "Add Row",

    inputs: ["$table", "$data"],
    outputs: ["table"],

    async onInputsReady({ $table, $data }) {
        await $table.addRow(
            Object.fromEntries(
                $data.map((item, i) => [this.state.dataLabels[i] ?? i, item])
            )
        )

        this.publish({ table: $table })
    },
}